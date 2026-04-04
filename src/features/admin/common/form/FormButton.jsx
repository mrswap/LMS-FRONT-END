const FormButton = ({ text, type = "submit", className = "" }) => {
  return (
    <button
      type={type}
      className={`w-full bg-[#22A699] hover:bg-[#1c8c82] text-white py-1.5 sm:py-2 rounded-lg text-sm sm:text-base transition-colors duration-200 ${className}`}
    >
      {text}
    </button>
  );
};

export default FormButton;
