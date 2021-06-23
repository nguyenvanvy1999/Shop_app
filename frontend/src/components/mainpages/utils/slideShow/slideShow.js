import React from 'react';
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const Slideshow = ({ images }) => {
	return (
		<div>
			<Zoom scale={0.4}>
				{images.map((each, index) => (
					<img key={index} style={{ width: '100%' }} src={each} alt="images" />
				))}
			</Zoom>
		</div>
	);
};
export default Slideshow;
