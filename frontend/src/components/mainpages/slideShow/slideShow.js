import React from 'react';
import { Slide } from 'react-slideshow-image';

const Slideshow = ({ images }) => {
	return (
		<div>
			<Slide easing="ease">
				{images.map((image, index) => (
					<div className="each-slide" key={index}>
						<div style={{ backgroundImage: `url(${image})` }}></div>
					</div>
				))}
			</Slide>
		</div>
	);
};
export default Slideshow;
