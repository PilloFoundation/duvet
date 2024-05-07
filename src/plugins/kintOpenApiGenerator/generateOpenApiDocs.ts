// type OpenAPIVersion = "3.0.0";

// type Info = {
//   title: string;
//   description: string;
//   version: string;
// };

// type Server = {
//   url: string;
//   description?: string;
// };

// type Method = "get" | "post" | "put" | "delete";

// // TODO: Add support for query, header and cookie parameters

// type PathParameter = {
//     name: string;
//     in: "path";
//     required: true;
//     schema: any;
// };

// type Path = {
//   [method in Method]: {
//     summary: string;
//     description: string;
//     parameters?: {
//       name: string;
//       in: "query" | "path";
//       required: boolean;
//       schema: any;
//     }[];
//     responses: {
//       [statusCode: string]: {
//         description: string;
//         content: {
//           applicationJson: {};
//         };
//       };
//     };
//   };
// };
