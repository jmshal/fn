export default async function (context: any, req: any) {
  context.res = {
    status: 200,
    body: 'Hello World',
  };
};
