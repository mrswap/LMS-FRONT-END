const FormButton = ({ text, type = "submit", className = "" }) => {
  return (
    <button
      type={type}
      className={`w-full bg-[#22A699] hover:bg-[#1c8c82] text-white py-2 rounded-lg ${className}`}
    >
      {text}
    </button>
  );
};

export default FormButton;
