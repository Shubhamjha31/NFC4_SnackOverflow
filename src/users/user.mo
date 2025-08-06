import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Result "mo:base/Result";
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
    fraud: Bool;
  };

  stable var isFraud: Bool = false;

  public type UserProfile = {
    bio : Text;
    credentials : [Credential];
  };

  // Each user's profile, keyed by Principal
  stable var profiles : [(Principal, UserProfile)] = [];

  // Each user's allowed viewers, keyed by Principal
  stable var allowedViewersMap : [(Principal, [Principal])] = [];

  // ---- Utility helpers ----

  // Find index of principal in array of (Principal, T)
  func findIndexForPrincipal<T>(array: [(Principal, T)], p: Principal) : ?Nat {
    var i = 0;
    for (item in array.vals()) {
      if (item.0 == p) return ?i;
      i += 1;
    };
    null
  };

  func findIndex<T>(array: [T], predicate: T -> Bool) : ?Nat {
  var i = 0;
  for (item in array.vals()) {
    if (predicate(item)) return ?i;
    i += 1;
  };
  null
};


  // Update or append a value at an index; returns the new array
  func updateOrAppend<T>(array: [T], idx: ?Nat, value: T) : [T] {
    switch (idx) {
      case (?i) {
        Array.tabulate<T>(
          array.size(),
          func(index : Nat) : T {
            if (index == i) value else array[index]
          }
        )
      };
      case null {
        Array.append(array, [value])
      };
    }
  };

  // ---- Per-user profile helpers ----

  // Get a profile for a user principal (returns ?UserProfile)
  func getProfile(user: Principal) : ?UserProfile {
    switch (findIndexForPrincipal(profiles, user)) {
      case null { null };
      case (?i) { ?profiles[i].1 };
    }
  };

  // Set or update profile for user
  func setProfile(user: Principal, profile: UserProfile) : async () {
    let idx = findIndexForPrincipal(profiles, user);
    profiles := updateOrAppend(profiles, idx, (user, profile));
  };

  // ---- Per-user allowed viewers helpers ----

  // Get allowed viewers for a user
  func getAllowedViewersFor(user: Principal) : [Principal] {
    switch (findIndexForPrincipal(allowedViewersMap, user)) {
      case null { [] };
      case (?i) { allowedViewersMap[i].1 };
    }
  };

  // Set allowed viewers for a user
  func setAllowedViewersFor(user: Principal, viewers: [Principal]) : async () {
    let idx = findIndexForPrincipal(allowedViewersMap, user);
    allowedViewersMap := updateOrAppend(allowedViewersMap, idx, (user, viewers));
  };

  // ---- Public shared API ----

  public shared({ caller }) func setBio(newBio: Text) : async Result.Result<(), Text> {
    if (newBio.size() > 1000) return #err("Bio too long");
    let profileOpt = getProfile(caller);
    let updatedProfile =
      switch profileOpt {
        case null { { bio = newBio; credentials = [] } };
        case (?profile) { { bio = newBio; credentials = profile.credentials } };
      };
    await setProfile(caller, updatedProfile);
    #ok(())
  };

  public shared({ caller }) func addCredential(cred: Credential) : async Result.Result<(), Text> {
    if (cred.id == "") return #err("Invalid credential ID");
    if (cred.degree == "") return #err("Degree cannot be empty");
    let profileOpt = getProfile(caller);
    let updatedProfile =
      switch profileOpt {
        case null { { bio = ""; credentials = [cred] } };
        case (?profile) {
          if (Option.isSome(
                findIndex<Credential>(profile.credentials, func(c: Credential) : Bool { c.id == cred.id })
          )) {
            return #err("Credential already exists");
          };
          { bio = profile.bio; credentials = Array.append(profile.credentials, [cred]) }
        };
      };
    await setProfile(caller, updatedProfile);
    #ok(())
  };

  public shared({ caller }) func updateCredential(cred: Credential) : async Result.Result<(), Text> {
  let profileOpt = getProfile(caller);
  switch profileOpt {
    case null { return #err("Profile not initialized"); };
    case (?profile) {
      let indexOpt = findIndex<Credential>(profile.credentials, func(c: Credential) : Bool { c.id == cred.id });
      switch indexOpt {
        case null { return #err("Credential not found"); };
        case (?index) {
          let original = profile.credentials[index];
          let updatedCred = {
            cred with
            issueDate = original.issueDate;
            issuer = original.issuer;
          };
          let updatedCreds = Array.tabulate<Credential>(
            profile.credentials.size(),
            func(i: Nat) : Credential {
              if (i == index) updatedCred else profile.credentials[i]
            }
          );
          let updatedProfile = { bio = profile.bio; credentials = updatedCreds };
          await setProfile(caller, updatedProfile);
          #ok(())
        };
      };
    };
  };
};


  public shared({ caller }) func grantAccessToViewer(newViewer: Principal) : async Result.Result<(), Text> {
    var viewers = getAllowedViewersFor(caller);
    if (Array.find(viewers, func(p : Principal) : Bool { p == newViewer }) != null) {
      return #err("User already has access");
    };
    viewers := Array.append(viewers, [newViewer]);
    await setAllowedViewersFor(caller, viewers);
    #ok(())
  };

  public shared({ caller }) func revokeAccessFromViewer(viewer: Principal) : async Result.Result<(), Text> {
    var viewers = getAllowedViewersFor(caller);
    switch(findIndex(viewers, func(p : Principal) : Bool { p == viewer })) {
      case null { return #err("User does not have access"); };
      case (?idx) {
        viewers := Array.tabulate(viewers.size() - 1, func(i : Nat) : Principal {
          if (i < idx) viewers[i] else viewers[i + 1]
        });
        await setAllowedViewersFor(caller, viewers);
        #ok(())
      };
    }
  };

  public shared({ caller }) func getAllowedViewers() : async [Principal] {
    getAllowedViewersFor(caller)
  };

  /// Get credentials by owner (yourself or another principal if allowed)
  public shared({ caller }) func getAllCredentials(profileOwner: ?Principal) : async Result.Result<[Credential], Text> {
    let owner = switch (profileOwner) {
      case null { caller };
      case (?p) { p };
    };

    let profileOpt = getProfile(owner);
    if (profileOpt == null) {
      return #ok([]);
    };

    if (caller == owner) {
      switch (profileOpt) {
        case (?p) { return #ok(p.credentials) };
        case null { return #ok([]) };
      };
    };

    // Check access
    let viewers = getAllowedViewersFor(owner);
    if (Array.find(viewers, func(p : Principal) : Bool { p == caller }) != null) {
      switch(profileOpt) {
        case (?p) { return #ok(p.credentials) };
        case null { return #ok([]) };
      };
    };

    return #err("Access denied");
  };
  public shared({ caller }) func isFraudulent() : async Bool {
    isFraud
  };
  public shared({ caller }) func markAsFraudulent() : async Result.Result<(), Text> {
    isFraud := true;
    #ok(())
  };
  public shared({ caller }) func markAsNotFraudulent() : async Result.Result<(), Text> {
    isFraud := false;
    #ok(()) 
  };

};
