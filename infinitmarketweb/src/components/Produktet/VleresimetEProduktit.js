import React from 'react';
import './Styles/VleresimetEProduktit.css'; // Import the CSS file
import { Button } from 'react-bootstrap';

function VleresimetEProduktit(props) {
  let totalRating = 0;
  let totalStars = 0;
  let maxStars = 5;

  // Calculate total rating and total stars
  props.reviews.forEach((review) => {
    totalRating += review.vlersimiYll;
    totalStars += review.vlersimiYll;
  });

  // Calculate average rating
  const averageRating = totalStars > 0 ? totalRating / props.reviews.length : 0;
  const ratingCount = props.reviews.length;

  // Function to render star icons based on the rating
  const renderStars = (rating) => {
    const starIcons = [];
    for (let i = 0; i < maxStars; i++) {
      if (i < rating) {
        starIcons.push(
          <span key={i} className="star">
            &#9733;
          </span>
        );
      } else {
        starIcons.push(
          <span key={i} className="star">
            &#9734;
          </span>
        );
      }
    }
    return starIcons;
  };

  return (
    <div className="product-reviews">
      <div className="overall-rating">
        <span className="average-rating">{averageRating.toFixed(2)}</span>
        <span className="rating-count"> ({ratingCount} vlerësime)</span>
        <div className="stars">{renderStars(averageRating)}</div>
      </div>
      <div className="write-review-button">
        <Button variant="primary">Write a Review</Button> {/* Bootstrap Button */}
      </div>
      {props.reviews.map((review, index) => (
        <div key={index} className="product-review">
          <div className="user">
            {review.emri} {review.mbiemri} - {review.email}
          </div>
          <div className="stars">{renderStars(review.vlersimiYll)}</div>
          <div className="review">{review.vlersimiTekst}</div>
        </div>
      ))}
    </div>
  );
}

export default VleresimetEProduktit;
