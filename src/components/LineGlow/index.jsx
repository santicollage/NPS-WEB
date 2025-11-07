import './LineGlow.scss';

function LineGlow({
  orientation = 'horizontal',
  width = '80%',
  glowPosition = '40%',
}) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <div
      className={`line-glow ${isHorizontal ? 'horizontal' : 'vertical'}`}
      style={{
        width: isHorizontal ? width : '3px',
        height: isHorizontal ? '3px' : width,
      }}
    >
      <div
        className="glow"
        style={{
          left: isHorizontal ? glowPosition : '50%',
          top: isHorizontal ? '' : glowPosition,
          transform: isHorizontal
            ? 'translate(0%, -50%)'
            : 'translate(-50%, 0%)',
        }}
      ></div>
    </div>
  );
}

export default LineGlow;
