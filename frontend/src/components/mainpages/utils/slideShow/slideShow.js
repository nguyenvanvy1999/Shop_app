import React from 'react';
import { Zoom } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const Slideshow = ({ images }) => {
	const zoomConfig = {
		duration: 2000,
		transitionDuration: 300,
		scale: 0.2,
		arrows: false,
	};
	return (
		<div>
			<Zoom {...zoomConfig}>
				{images.map((each, index) => (
					<img key={index} style={{ width: '100%' }} src={each} alt="images" />
				))}
			</Zoom>
		</div>
	);
};
export default Slideshow;
