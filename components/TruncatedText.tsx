import exp from "constants";

const TruncatedText = ({ text }: { text: string }) => {
    return (
      <div className="max-h-[3em] overflow-hidden relative">
        <div className="line-clamp-1">{text}</div>
        {text.length > 100 && (
          <span className="absolute bottom-0 right-0 bg-white pl-1"></span>
        )}
      </div>
    );
  };


export default TruncatedText;