import React, { useMemo } from "react";
import "./avatar.css";

const LettersAvatar = ({ firstName, lastName, imageSrc, width, height }) => {
  const firstNameInitial = firstName?.[0] ? firstName[0].toUpperCase() : "";
  const lastNameInitial = lastName?.[0] ? lastName[0].toUpperCase() : "";
  const getRandomColor = useMemo(() => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 15)];
    }
    return color !== "#000000" ? color : getRandomColor(); 
  }, []);

  const avatarStyle = {
    backgroundColor: getRandomColor,
    color: "#ffffff",
    fontSize: "30px",
  };

  return (
    <span
      style={{ width: width, height: height }}
      className={imageSrc ? "user-profile-image_image" : "user-profile-image"}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          height={30}
          width={30}
          alt={`${firstName} ${lastName}`}
          className="avatar-image"
        />
      ) : (
        <>
          <div style={avatarStyle}>{firstNameInitial}</div>
          <div style={avatarStyle}>{lastNameInitial}</div>
        </>
      )}
    </span>
  );
};

export default LettersAvatar;
