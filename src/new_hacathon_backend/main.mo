import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

persistent actor Main {
  stable var registeredInstitutes: [Principal] = [];
  stable var registeredUsers: [Principal] = [];

  public func registerInstitute(institute: Principal) : async () {
    
  };

  public func registerUser(user: Principal) : async () {
    
  };

  public query func isRegisteredInstitute(inst: Principal) : async Bool {
    return true;
  };

}