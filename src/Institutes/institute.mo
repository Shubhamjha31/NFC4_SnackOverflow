import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Error "mo:base/Error";

persistent actor Institute {

  // User canister Credential type and actor interface defined inside Institute
  public type UserCredential = {
    id : Text;
    issuer : Principal;
    degree : Text;
    issueDate : Int;
    expiry : ?Int;
    revoked : Bool;
    image : Text;
  };

  public type UserActor = actor {
    addCredential : shared UserCredential -> async Result.Result<(), Text>;
    updateCredential : shared UserCredential -> async Result.Result<(), Text>;
    getCredential : shared query Text -> async ?UserCredential;
  };

  public type Credential = {
    id : Text;
    owner : Principal;
    institute : Principal;
    degree : Text;
    issueDate : Int;
    expiry : ?Int;
    revoked : Bool;
    image : Text;
  };

  stable var issuedCredentials : [Credential] = [];

  stable var instituteName : Text = "Default Institute Name";
  stable var instituteLogo : Text = "https://default.logo.url/logo.png";

  // Helper: Find index of credential by owner and id
  func findCredentialIndex(owner: Principal, credId: Text) : ?Nat {
    var i: Nat = 0;
    while (i < Array.size(issuedCredentials)) {
      if (issuedCredentials[i].owner == owner and issuedCredentials[i].id == credId) {
        return ?i;
      };
      i += 1;
    };
    return null;
  };

  // Query institute info
  public query func getInstituteInfo() : async { name: Text; logo: Text } {
    { name = instituteName; logo = instituteLogo }
  };

  // Update institute info (consider adding access control)
  public shared({ caller }) func setInstituteInfo(name: Text, logo: Text) : async Result.Result<(), Text> {
    if (name == "") return #err("Institute name cannot be empty");
    if (logo == "") return #err("Institute logo URL cannot be empty");

    instituteName := name;
    instituteLogo := logo;

    #ok(())
  };

  // Issue new credential, requires user canister Principal explicitly
  public shared({ caller }) func issueCredential(
    userCanisterId: Principal,
    owner: Principal,
    degree: Text,
    image: Text,
    expiry: ?Int
  ) : async Result.Result<Credential, Text> {

    if (Principal.isAnonymous(owner)) return #err("Cannot issue to anonymous principal");
    if (degree == "") return #err("Degree cannot be empty");
    if (image == "") return #err("Image URL cannot be empty");

    try {
      let issuer = Principal.fromActor(Institute);

      // Prevent duplicate degree issuance
      switch (Array.find(issuedCredentials, func(c: Credential) : Bool {
        c.owner == owner and c.degree == degree
      })) {
        case (?_) return #err("User already has this degree");
        case null {};
      };

      let newId = "cred-" # Nat.toText(issuedCredentials.size() + 1);
      let cred : Credential = {
        id = newId;
        owner = owner;
        institute = issuer;
        degree = degree;
        issueDate = Time.now();
        expiry = expiry;
        revoked = false;
        image = image;
      };

      issuedCredentials := Array.append(issuedCredentials, [cred]);

      let userActor : UserActor = actor(Principal.toText(userCanisterId));

      let userCredential : UserCredential = {
        id = cred.id;
        issuer = issuer;
        degree = cred.degree;
        issueDate = cred.issueDate;
        expiry = cred.expiry;
        revoked = false;
        image = cred.image;
      };

      switch (await userActor.addCredential(userCredential)) {
        case (#err(e)) {
          // Rollback issued credentials on failure
          issuedCredentials := Array.filter<Credential>(issuedCredentials, func(c: Credential) : Bool {
            c.id != cred.id
          });
          #err("Failed to add credential to user: " # e)
        };
        case (#ok()) #ok(cred);
      };

    } catch (e) {
      #err("Unexpected error during issuance: " # Error.message(e))
    }
  };

  // Revoke credential, updating both institute and user
  public shared({ caller }) func revokeCredential(
    userCanisterId: Principal,
    owner: Principal,
    credId: Text
  ) : async Result.Result<(), Text> {

    if (Principal.isAnonymous(owner)) return #err("Anonymous principal cannot revoke credentials");

    try {
      switch (findCredentialIndex(owner, credId)) {
        case null {
          #err("Credential not found for this owner");
        };
        case (?index) {
          let cred = issuedCredentials[index];
          if (cred.revoked) return #err("Credential already revoked");

          let revokedCred = { cred with revoked = true };

          issuedCredentials := Array.tabulate<Credential>(
            issuedCredentials.size(),
            func(i: Nat) : Credential {
              if (i == index) revokedCred else issuedCredentials[i]
            }
          );

          let userActor : UserActor = actor(Principal.toText(userCanisterId));

          let userCredential : UserCredential = {
            id = cred.id;
            issuer = cred.institute;
            degree = cred.degree;
            issueDate = cred.issueDate;
            expiry = cred.expiry;
            revoked = true;
            image = cred.image;
          };

          switch (await userActor.updateCredential(userCredential)) {
            case (#err(e)) {
              // Rollback on user update failure
              issuedCredentials := Array.tabulate<Credential>(
                issuedCredentials.size(),
                func(i: Nat) : Credential {
                  if (i == index) cred else issuedCredentials[i]
                }
              );
              #err("Failed to update user credential: " # e)
            };
            case (#ok()) #ok();
          };
        };
      };
    } catch (e) {
      #err("Unexpected error during revocation: " # Error.message(e))
    }
  };

  // Queries

  public query func getAllCredentials() : async [Credential] {
    issuedCredentials
  };

  public query func getCredentialsByOwner(owner: Principal) : async [Credential] {
    Array.filter<Credential>(issuedCredentials, func(c: Credential) : Bool { c.owner == owner })
  };

  public query func getCredentialById(credId: Text) : async ?Credential {
    Array.find<Credential>(issuedCredentials, func(c: Credential) : Bool { c.id == credId })
  };
}
