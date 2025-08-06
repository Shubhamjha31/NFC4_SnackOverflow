import { useParams } from 'react-router-dom';

const VerifyPage = () => {
  const { principalId } = useParams();
  return (
    <div>
      <h1>Verifying Wallet ID</h1>
      <p>Principal: {principalId}</p>
    </div>
  );
};

export default VerifyPage;
