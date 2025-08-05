import Principal "mo:base/Principal";

type Credential = {
  id: Text;
  issuer: Principal;
  degree: Text;
  issueDate: Int;
  revoked: Bool;
};

persistent actor User {
  stable var credentials: [Credential] = [];
  stable var accessPermissions: [(Text, Principal)] = []; // Credential ID and viewer principal pairs

  // Called by institute canister to deliver credential
  public func receiveCredential(cred: Credential) : async () {
    
  };

  // Student grants access to an employer/verifier
  public func grantAccess(credId: Text, who: Principal) : async () {
    
  };

  public func revokeAccess(credId: Text, who: Principal) : async () {
    
  };

  public query func canAccess(credId: Text, who: Principal) : async Bool {
    return true;
  };

  public query func getCredentials() : async [Credential] {
    credentials
  };
}
