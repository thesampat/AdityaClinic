import { useParams } from 'react-router-dom';

export const HealthPackage = () => {
  const { packageType } = useParams();
  return (
    <div className="p-20">
      <h1 className="text-5xl font-bold">{packageType}</h1>
    </div>
  );
};
