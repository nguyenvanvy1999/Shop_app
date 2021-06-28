import React from 'react';
import { url } from '../../../../const';

function ImageItem({ image, deleteImage }) {
	return (
		<div className="image_card" key={image._id}>
			<img src={image?.path ? `${url}/${image.path}`.replace('uploads', '') : undefined} alt="" />
			<button onClick={deleteImage.bind(this, image)} className="btn_delete">
				Delete
			</button>
		</div>
	);
}

export default ImageItem;
