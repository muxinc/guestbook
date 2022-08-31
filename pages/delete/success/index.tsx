import Link from "next/link";

const DeleteSuccess = () => (
  <div className="p-8">
    <h1 className="text-xl mb-4">Delete Success!</h1>
    <Link href="/">
      <a>&larr; Go Home</a>
    </Link>
  </div>
);

export default DeleteSuccess;
