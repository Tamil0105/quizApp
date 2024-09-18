
const AssessmentCard = () => {
  return (
    <div
      className="relative p-6 shadow-md"
      style={{
        clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0 100%, 0 20px)',
        width: '300px',
        height: '150px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to right, #faf5ff 60%, rgba(255, 255, 255, 0))', // Fade-out effect for the card
        border: '2px solid transparent',
        borderImage: 'linear-gradient(to right, #6B46C1 60%, rgba(107, 70, 193, 0)) 1', // Fade-out effect for the border
      }}
    >
      {/* Top-left colored polygon cut */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '19px',
          height: '19px',
          backgroundColor: '#6B46C1',
          clipPath: 'polygon(0 0, 100% 0, 0 100%)',
        }}
      ></div>

      {/* Card Content */}
      <div className="relative z-10">
        <div className="text-gray-700 text-xl font-semibold">Total Assessments</div>
        <div className="text-purple-700 text-5xl font-bold">12</div>
      </div>
    </div>
  );
};

export default AssessmentCard;
