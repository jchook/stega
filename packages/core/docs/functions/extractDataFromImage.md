# Function: extractDataFromImage

▸ **extractDataFromImage**(`rgba`, `seed?`): `Uint8Array`

Extracts hidden data from an image's RGBA colorspace data.
This is the inverse of embedDataInImage.

The supplied rgba array is not modified.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `rgba` | [`RgbaData`](../types/RgbaData.md) | `undefined` |
| `seed` | `undefined` \| `number` | `undefined` |

#### Returns

`Uint8Array`
