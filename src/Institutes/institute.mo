import Main "canister:new_hacathon_backend";
import User "canister:users";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Array "mo:base/Array";

persistent actor Institute {
    type Credential = {
        id: Text;
        owner: Principal;
        institute: Principal;
        degree: Text;
        issueDate: Time.Time;
        revoked: Bool;
        image: Text;
    };
    
    stable var issuedCredentials: [Credential] = [];

    public func issueCredential(
    owner: Principal,
    degree: Text,
    image: Text
  ) : async Credential {
    let newId = "cred-" # Nat.toText(issuedCredentials.size() + 1);
    let issuer = Principal.fromActor(Institute);

    let cred: Credential = {
      id = newId;
      owner = owner;
      institute = issuer;
      degree = degree;
      issueDate = Time.now();
      revoked = false;
      image = image;
    };

    issuedCredentials := Array.append(issuedCredentials, [cred]);

    return cred;
  };

  public func revokeCredential(owner: Principal, credId: Text) : async Bool {
    var found = false;
    var index : Nat = 0;
    let len = Array.size(issuedCredentials);

    var i : Nat = 0;
    label search loop {
        if (i >= len) {
            break search;
        };

        let cred = issuedCredentials[i];
        if (cred.owner == owner and cred.id == credId) {
            found := true;
            index := i;
            break search;
        };
        i += 1;
    };

    if (not found) {
        return false;
    };

    let cred = issuedCredentials[index];
    let revokedCred = {
        id = cred.id;
        owner = cred.owner;
        institute = cred.institute;
        degree = cred.degree;
        issueDate = cred.issueDate;
        revoked = true;
        image = cred.image;
    };

    // Manually copy array and replace at index
    let newArray = Array.tabulate<Credential>(len, func(i: Nat): Credential {
        if (i == index) {
            revokedCred
        } else {
            issuedCredentials[i]
        }
    });

    issuedCredentials := newArray;
    return true;
    };



}