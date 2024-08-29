import { useParams } from 'react-router-dom';

export const Testimonials = () => {
  const { testimonialType } = useParams();
  return (
    <div className="p-20">
      <h1 className="text-5xl font-bold">{testimonialType}</h1>
    </div>
  );
};
