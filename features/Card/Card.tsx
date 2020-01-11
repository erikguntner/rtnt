import React, { useState } from "react";
import styles from "./Card.scss";

const Card = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const transform = e => {
    var offset = e.target.getBoundingClientRect();

    const position = {
      x: e.pageX - offset.left - offset.width / 2,
      y: e.pageY - offset.top - offset.height / 2
    };

    setOffset({ x: position.x * 0.3, y: position.y * 0.2 });
  };

  return (
    <div
      className={styles.container}
      onMouseMove={transform}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={{
        transform: `perspective(800px) rotateX(${
          offset.y
        }deg) rotateY(${offset.x * -1}deg) scale3d(1,1,1)`
      }}
    >
      <div className={styles.image}>
        <div className={styles.triangle}></div>
      </div>
      <div>
        <h4>TriNet</h4>
        <p>Bringing meaningful HR to businesses</p>
      </div>
    </div>
  );
};

export default Card;
