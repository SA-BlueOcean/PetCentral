import { api } from "@/utils/api";

export function FetchGroupData() {
  const query = api.groups.fetchDetails.useQuery({
    groupID: "ckljsd9873abc",
  });
  const utils = api.useUtils();

  const get = () => {
    console.log(query.data);
  };

  if (query.isLoading) {
    return <div>is loading</div>;
  }
  if (query.isError) {
    return <div> error</div>;
  }

  return <div>{query.data.group}</div>;
}
