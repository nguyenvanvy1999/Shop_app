import ImageUploading from 'react-images-uploading';
import React from 'react';

const UploadImage = ({ images, handlerUpload, maxNumber }) => {
	return (
		<ImageUploading multiple value={images} onChange={handlerUpload} maxNumber={maxNumber} dataURLKey="data_url">
			{({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
				<div className="upload__image-wrapper">
					<button style={isDragging ? { color: 'red' } : undefined} onClick={onImageUpload} {...dragProps}>
						Click or Drop here
					</button>
					&nbsp;
					<button onClick={onImageRemoveAll}> Remove all images</button>
					{imageList.map((image, index) => (
						<div key={index} className="image-item">
							<img src={image['data_url']} alt="" width={100} height={100} />
							<div className="image-item__btn-wrapper">
								<button onClick={() => onImageUpdate(index)}>Update</button>
								<button onClick={() => onImageRemove(index)}>Remove</button>
							</div>
						</div>
					))}
				</div>
			)}
		</ImageUploading>
	);
};

export default UploadImage;
