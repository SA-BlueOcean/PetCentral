import { useState } from "react";
import { supabase } from "lib/supabase";
import { v4 as uuidv4 } from "uuid";

export default function PhotoInput({
  profileId,
  tag,
  update,
}: {
  profileId: string;
  tag: string;
  update: (url: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!file) {
      return; // handle the case when file is null
    }
    const filename = `${profileId}-${uuidv4()}-${tag}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: true,
      });
    update(filename);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  return (
    <div>
      <input
        type="file"
        name="image"
        onChange={handleFileSelected}
        className="file-input-neutral file-input file-input-bordered file-input-sm w-full max-w-xs hover:file-input-secondary"
      />
      <button onClick={handleSubmit}>Submit Photo</button>
    </div>
  );
}
