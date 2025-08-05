
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Error "mo:base/Error";
import Option "mo:base/Option";

persistent actor Main {
  stable var registeredInstitutes : [Principal] = [];
  stable var registeredUsers : [Principal] = [];

  // More efficient contains check using Array.find
  func containsPrincipal(arr : [Principal], p : Principal) : Bool {
    Option.isSome(Array.find<Principal>(arr, func(principal) = principal == p))
  };

  // Register institute with better error handling
  public shared({ caller }) func registerInstitute() : async Result.Result<(), Text> {
    try {
      if (Principal.isAnonymous(caller)) {
        return #err("Anonymous callers cannot register as institutes");
      };
      if (containsPrincipal(registeredInstitutes, caller)) {
        return #err("Institute already registered");
      };
      
      registeredInstitutes := Array.append(registeredInstitutes, [caller]);
      #ok(())
    } catch (e) {
      #err("Failed to register institute: " # Error.message(e))
    }
  };

  // Register user with better error handling
  public shared({ caller }) func registerUser() : async Result.Result<(), Text> {
    try {
      if (Principal.isAnonymous(caller)) {
        return #err("Anonymous callers cannot register as users");
      };
      if (containsPrincipal(registeredUsers, caller)) {
        return #err("User already registered");
      };
      
      registeredUsers := Array.append(registeredUsers, [caller]);
      #ok(())
    } catch (e) {
      #err("Failed to register user: " # Error.message(e))
    }
  };

  // Query functions
  public query func isRegisteredInstitute(p : Principal) : async Bool {
    containsPrincipal(registeredInstitutes, p)
  };

  public query func isRegisteredUser(p : Principal) : async Bool {
    containsPrincipal(registeredUsers, p)
  };

  public query func getAllInstitutes() : async [Principal] {
    registeredInstitutes
  };

  public query func getAllUsers() : async [Principal] {
    registeredUsers
  };

  // Upgrade hooks for future compatibility
  system func preupgrade() {
    // Can add pre-upgrade logic here if needed
  };

  system func postupgrade() {
    // Can add post-upgrade logic here if needed
  };
}