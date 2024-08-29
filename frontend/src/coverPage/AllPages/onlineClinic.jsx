import { useParams } from 'react-router-dom';

export const OnlineClinic = () => {
  const { ocType } = useParams();
  return (
    <div className="p-20">
      <h1 className="text-5xl font-bold">{ocType}</h1>
    </div>
  );
};
