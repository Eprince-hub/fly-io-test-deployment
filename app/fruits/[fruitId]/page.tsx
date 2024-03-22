import { notFound } from 'next/navigation';
import { getFruit } from '../../../database/fruits';
import { getCookie } from '../../../util/cookies';
import { parseJson } from '../../../util/json';
import { FruitComment } from './actions';
import FruitCommentForm from './FruitCommentForm';

export const metadata = {
  default: 'Single Fruit page',
  description: 'Generated by create next app',
};

type Props = {
  params: {
    fruitId: string;
  };
};

export default function SingleFruitPage(props: Props) {
  console.log(props);

  const fruit = getFruit(Number(props.params.fruitId));

  if (!fruit) {
    notFound();
  }

  // get cookie and parse it!
  const fruitsCommentsCookie = getCookie('fruitComments');

  const fruitComments = !fruitsCommentsCookie
    ? []
    : parseJson(fruitsCommentsCookie) || [];

  const fruitCommentToDisplay = fruitComments.find(
    (fruitComment: FruitComment) => {
      return fruitComment.id === fruit.id;
    },
  );

  return (
    <>
      <h1>
        {fruit.icon} {fruit.name}
      </h1>
      {/* Optional Chaining, means if fruitCommentToDisplay === undefined, return undefined, else display fruitCommentToDisplay.comment */}
      <div>{fruitCommentToDisplay?.comment}</div>
      <FruitCommentForm fruitId={fruit.id} />
    </>
  );
}
