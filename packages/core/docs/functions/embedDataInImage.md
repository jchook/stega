# Function: embedDataInImage

▸ **embedDataInImage**(`rgba`, `data`, `seed?`): `void`

Embeds hidden data into an image's RGBA colorspace data.

Data is embedded into the least significant bits of pseudorandom pixel
channels. The order is determined by an LCG generator. The generator will
skip indices that are out of bounds or are the alpha channel.

Choosing an LCG generator ensures that storage capacity is maximized, while
the data is also stochastically distributed throughout the image.

Note that the supplied array is modified in-place.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `rgba` | [`RgbaData`](../types/RgbaData.md) | `undefined` |
| `data` | `Uint8Array` | `undefined` |
| `seed` | `undefined` \| `number` | `undefined` |

#### Returns

`void`
