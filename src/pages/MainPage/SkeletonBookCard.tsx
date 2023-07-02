import './SkeletonBookCard.css';

const SkeletonBookCard = () => {
  return (
    <div className="skeleton-book-card">
      <div className="skeleton-book-card-image"></div>
      <div className="skeleton-book-card-title"></div>
      <div className="skeleton-book-card-author"></div>
    </div>
  );
};

export default SkeletonBookCard;