import Image from "next/image";

const MediaRenderer = ({ url, alt }: { url: string; alt: string }) => {
  // Extract file extension
  const fileExtension = url.split(".").pop()?.toLowerCase();
  if (!fileExtension) {
    return <p>Invalid URL</p>;
  }

  // Render based on file extension
  if (fileExtension === "mp4") {
    return (
      <video about={alt} className="w-full" width={500} height={500} controls>
        <source src={url} about={alt} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  if (
    fileExtension === "png" ||
    fileExtension === "jpg" ||
    fileExtension === "jpeg"
  ) {
    return (
      <Image
        className="w-full"
        src={url}
        alt={alt}
        about={alt}
        width={500}
        height={500}
      />
    );
  }

  return <p>Unsupported media format</p>;
};
export default MediaRenderer;
