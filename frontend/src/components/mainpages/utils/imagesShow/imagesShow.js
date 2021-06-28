import React, { useContext, useEffect, useState } from 'react';
import ImageItem from '../imageItem/imageItem';
import axios from 'axios';
import { GlobalState } from '../../../../GlobalState';
import { url } from '../../../../const';

function ImagesShow({ images, productId }) {
	const state = useContext(GlobalState);
	const [token] = state.token;
	const [test, setTest] = useState([]);

	useEffect(() => {
		setTest(images);
	}, [images]);

	const onDelete = async (item) => {
		try {
			const res = await axios.put(
				`${url}/product/slide/${productId}`,
				{ image: item._id },
				{
					headers: { Authorization: token },
				}
			);
			setTest(res.data.slide);
			return;
		} catch (error) {
			alert(error.response.data.message);
		}
	};
	return (
		<div>
			{test.map((each, index) => (
				<ImageItem image={each} deleteImage={onDelete} key={each._id} />
			))}
		</div>
	);
}

export default ImagesShow;
