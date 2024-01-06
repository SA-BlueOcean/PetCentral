import { api } from "@/utils/api";

export function Example() {
  const query = api.example.hello.useQuery({
    text: "hello from example component",
  });
  const utils = api.useUtils();
  const mutation = api.example.create.useMutation();

  const handleForm = () => {
    mutation.mutate(
      {
        content: "some content",
      },
      {
        onSuccess: () => {
          console.log("success");
          // invalidate current query to clear current local cache
          // and trigger a refetch
          void utils.example.hello.invalidate();
        },
      },
    );
  };

  if (query.isLoading) {
    return <div>is loading</div>;
  }
  if (query.isError) {
    return <div> error</div>;
  }

  return <div>{query.data.greeting}</div>;
}
