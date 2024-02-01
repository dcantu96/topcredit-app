import {
  DocumentIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid";

interface FileViewerProps {
  label: string;
  fileName?: string;
  fileDate?: string;
  fileSize?: string;
}

const FileViewer = ({
  label,
  fileDate = "-",
  fileName = "-",
  fileSize = "-",
}: FileViewerProps) => {
  return (
    <>
      <label className="text-gray-900 font-medium leading-6 text-sm">
        {label}
      </label>
      <div className="ring-1 ring-gray-300 rounded-md w-full p-4 mt-2">
        <div className="flex justify-between w-full mb-4">
          <DocumentIcon className="h-5 w-5 text-gray-500" />
          <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
        </div>
        <p className="text-gray-900 font-medium mb-2">{fileName}</p>
        <p className="text-gray-500 text-sm">
          {fileDate} &#x2022; {fileSize}
        </p>
      </div>
    </>
  );
};

export default FileViewer;
