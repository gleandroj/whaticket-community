import Queue from "../../models/Queue";

type Params = {
  companyId?: number;
};

const ListQueuesService = async (params?: Params): Promise<Queue[]> => {
  const queues = await Queue.scope([
    { method: ["companyId", params?.companyId] }
  ]).findAll({ order: [["name", "ASC"]] });

  return queues;
};

export default ListQueuesService;
