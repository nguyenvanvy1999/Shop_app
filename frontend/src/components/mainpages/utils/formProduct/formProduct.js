import React from 'react';

const FormProduct = ({ handleSubmit, name, handleChangeInput, product, categories }) => {
	return (
		<form onSubmit={handleSubmit}>
			<div className="row">
				<label htmlFor="product_id">Product ID</label>
				<input type="text" name="ID" id="ID" required value={product.ID} onChange={handleChangeInput} />
			</div>

			<div className="row">
				<label htmlFor="title">Title</label>
				<input type="text" name="title" id="title" required value={product.title} onChange={handleChangeInput} />
			</div>

			<div className="row">
				<label htmlFor="price">Price</label>
				<input type="number" name="price" id="price" required value={product.price} onChange={handleChangeInput} />
			</div>

			<div className="row">
				<label htmlFor="description">Description</label>
				<textarea
					type="text"
					name="description"
					id="description"
					required
					value={product.description}
					rows="5"
					onChange={handleChangeInput}
				/>
			</div>

			<div className="row">
				<label htmlFor="content">Content</label>
				<textarea
					type="text"
					name="content"
					id="content"
					required
					value={product.content}
					rows="7"
					onChange={handleChangeInput}
				/>
			</div>

			<div className="row">
				<label htmlFor="categories">Categories: </label>
				<select name="category" value={product.category} onChange={handleChangeInput}>
					<option value="">Please select a category</option>
					{categories.map((category) => (
						<option value={category._id} key={category._id}>
							{category.name}
						</option>
					))}
				</select>
			</div>

			<button type="submit">{name}</button>
		</form>
	);
};

export default FormProduct;
