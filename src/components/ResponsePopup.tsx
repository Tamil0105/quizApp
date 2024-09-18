// // components/ResponsesPopup.tsx
// import { useStore } from '../store/useStore';

// const ResponsesPopup = ({ testId }: { testId: string }) => {
//   const { tests } = useStore();
//   const test = tests.find((test) => test.id === testId);

//   if (!test) return null;

//   return (
//     <div className="popup">
//       <h2>{test.name} - Responses</h2>
//       <ul>
//         {test.questions.map((q) => (
//           <li key={q.id}>
//             <h3>{q.question}</h3>
//             <ul>
//               {q.options.map((option, index) => (
//                 <li key={index}>{option}</li>
//               ))}
//             </ul>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ResponsesPopup;
