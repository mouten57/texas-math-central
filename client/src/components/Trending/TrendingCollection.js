import React from "react";
import { Image, Item } from "semantic-ui-react";
import TrendingItem from "./TrendingItem";
const paragraph = (
  <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
);

const data = [
  {
    _id: 1,
    image:
      "https://texas-math-central.s3.amazonaws.com/1fdeef0a-3d02-43d1-aa2b-6b054fbd092f_thumbnail.png",
    header: "Arrowhead Valley Camp",
    meta: "$1200 1 Month",
    description: paragraph,
  },
  {
    _id: 2,
    image:
      "https://texas-math-central.s3.amazonaws.com/1fdeef0a-3d02-43d1-aa2b-6b054fbd092f_thumbnail.png",
    header: "Buck's Homebrew Stayaway",
    meta: "$1000 2 Weeks",
    description: paragraph,
  },
  {
    _id: 3,
    image:
      "https://texas-math-central.s3.amazonaws.com/1fdeef0a-3d02-43d1-aa2b-6b054fbd092f_thumbnail.png",
    header: "Buck's Homebrew Stayaway",
    meta: "$1000 2 Weeks",
    description: paragraph,
  },
];

const ItemExampleMetadata = () => (
  <Item.Group>
    {data.map(({ _id, unit, files = [], header, meta, description }, idx) => {
      return (
        <TrendingItem
          key={_id}
          _id={_id}
          unit={unit}
          image={files[0]?.s3ThumbnailLink || files[0]?.s3Link}
          header={header}
          meta={meta}
          description={description}
        />
      );
    })}
  </Item.Group>
);

export default ItemExampleMetadata;
