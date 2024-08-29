import { useParams } from 'react-router-dom';
import Nutrion from '../../Routes/publicRoutes/alternative_therapies/nutrion';

export const ThearapyPackage = () => {
  const { threapyType } = useParams();
  return (
    <div className="p-20">
      <Nutrion />
    </div>
  );
};
