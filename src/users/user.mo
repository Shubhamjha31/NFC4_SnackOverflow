import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Option "mo:base/Option";
import Nat "mo:base/Nat";

persistent actor User {
  public type Credential = {
    id : Text;
    issuer : Principal;
    degree : Text;
    issueDate : Int;
    expiry : ?Int;
    revoked : Bool;
    image : Text;
  };

  public type UserProfile = {
    bio : Text;
    credentials : [Credential];
  };

  stable var profile : ?UserProfile = null;

  func findIndex<T>(array : [T], predicate : T -> Bool) : ?Nat {
    var i = 0;
    for (item in array.vals()) {
      if (predicate(item)) return ?i;
      i += 1;
    };
    null
  };

  public shared({ caller }) func setBio(newBio : Text) : async Result.Result<(), Text> {
    if (newBio.size() > 1000) return #err("Bio too long");
    try {
      switch (profile) {
        case (null) { profile := ?{ bio = newBio; credentials = [] } };
        case (?p) { profile := ?{ bio = newBio; credentials = p.credentials } };
      };
      #ok(())
    } catch (e) {
      #err("Failed to update bio: " # Error.message(e))
    }
  };

  public shared({ caller }) func addCredential(cred : Credential) : async Result.Result<(), Text> {
    try {
      if (cred.id == "") return #err("Invalid credential ID");
      if (cred.degree == "") return #err("Degree cannot be empty");
      
      switch (profile) {
        case (null) { profile := ?{ bio = ""; credentials = [cred] } };
        case (?p) {
          if (Option.isSome(findIndex<Credential>(p.credentials, func(c : Credential) : Bool { c.id == cred.id }))) {
            return #err("Credential already exists");
          };
          profile := ?{ bio = p.bio; credentials = Array.append<Credential>(p.credentials, [cred]) };
        };
      };
      #ok(())
    } catch (e) {
      #err("Failed to add credential: " # Error.message(e))
    }
  };

  public shared({ caller }) func updateCredential(cred : Credential) : async Result.Result<(), Text> {
    try {
      switch (profile) {
        case (null) { #err("Profile not initialized") };
        case (?p) {
          switch (findIndex<Credential>(p.credentials, func(c : Credential) : Bool { c.id == cred.id })) {
            case (null) { #err("Credential not found") };
            case (?index) {
              let original = p.credentials[index];
              let updatedCred = {
                cred with 
                issueDate = original.issueDate;
                issuer = original.issuer;
              };
              
              let updated = Array.tabulate<Credential>(
                p.credentials.size(),
                func(i : Nat) : Credential = if (i == index) updatedCred else p.credentials[i]
              );
              profile := ?{ bio = p.bio; credentials = updated };
              #ok(())
            };
          };
        };
      };
    } catch (e) {
      #err("Failed to update credential: " # Error.message(e))
    }
  };

  // Add other public/shared functions here...

};
