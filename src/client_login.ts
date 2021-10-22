import { createClient } from "graphql-ws";
import ws from "ws";

const client = createClient({
  // url: "ws://studio.laceti.com.br:4000/graphql",
  url: "ws://localhost:4000/graphql",
  webSocketImpl: ws,
});

// query
(async () => {
  const result = await new Promise((resolve) => {
    let result: unknown;
    client.subscribe(
      {
        // query: '{  users {    value {      id      firstName      lastName    } } }',
        query:
          '{ login (email: "admin@teste.com", password: "123") { token } }',
      },
      {
        next: (data) => (result = data),
        error: (error) => console.log(error), //reject,
        complete: () => resolve(result),
      }
    );
  });
  console.log(result);
  return result;

  // expect(result).toEqual({ hello: 'Hello World!' });
})();

// (async () => {
//   const onNext = () => {
//     /* handle incoming values */
//   };

//   let unsubscribe = () => {
//     /* complete the subscription */
//   };

//   await new Promise((resolve, reject) => {
//     unsubscribe = client.subscribe(
//       {
//         query: 'subscription { greetings }',
//       },
//       {
//         next: onNext,
//         error: reject,
//         complete: () => resolve,
//       },
//     );
//   });

//   console.log (unsubscribe);

//   // expect(onNext).toBeCalledTimes(5); // we say "Hi" in 5 languages
// })();
