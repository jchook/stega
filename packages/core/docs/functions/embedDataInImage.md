# Function: embedDataInImage

▸ **embedDataInImage**(`rgba`, `data`, `seed`): `void`

Embeds hidden data into an image's RGBA colorspace data.

Data is embedded into "random" pixel channels. The order is determined by an
LCG generator. The generator will skip indices that are out of bounds or are
the alpha channel.

Choosing an LCG generator ensures that storage capacity is maximized, while
the data is also stochastically distributed throughout the image.

#### Parameters

| Name | Type |
| :------ | :------ |
| `rgba` | [`RgbaData`](../types/RgbaData.md) |
| `data` | `Uint8Array` |
| `seed` | `undefined` \| `number` |

#### Returns

`void`
