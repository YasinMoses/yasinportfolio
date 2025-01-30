import React, { useState } from "react";
// import PropTypes from 'prop-types'
import StarRatings from "react-star-ratings";

const Reviews = (props) => {
  const [rating, setRating] = useState(0);

  return (
    <div className="row mb-5">
      <div className="col-12 col-sm-6" />
      <div className="col-12 col-sm-6">
        <div
          className="review-container"
          style={{
            background: "#f4f5f6",
            padding: "2rem 2rem",
            borderTop: "2px solid rgb(216 214 214)",
          }}
        >
          <div
            style={{
              borderBottom: "1px solid rgb(216 214 214)",
              marginBottom: "1.5rem",
            }}
          >
            <h4>Write a review</h4>
          </div>
          <div className="form-group">
            <label>
              <b>
                Review&nbsp;<span style={{ color: "red" }}>*</span>
              </b>
            </label>
            <textarea
              type="text"
              rows="8"
              className="form-control"
              placeholder="Write review here..."
              name="review"
              onChange={(e) => console.log(e)}
            />
          </div>
          <div className="form-group">
            <label>
              <b>
                Rating&nbsp;<span style={{ color: "red" }}>*</span>
              </b>
            </label>
            <div
              className="d-flex align-items-center flex-wrap"
              style={{ gap: ".5rem" }}
            >
              <StarRatings
                rating={rating}
                starRatedColor="#d4af37"
                changeRating={(value) => setRating(value)}
                numberOfStars={5}
                starDimension="20px"
                starSpacing="3px"
                starHoverColor="#d4af37"
                name="rating"
              />
              <span className="text-muted">Click to rate </span>
            </div>
          </div>
          <div className="form-group mt-4">
            <button className="btn btn-success btn-sm">Submit Review</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
