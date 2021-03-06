import type { RequestHandler } from '@sveltejs/kit';
import { customAlphabet } from 'nanoid';
import Post from '$lib/db/post';

const nanoid = customAlphabet('1234567890abcdef', 10);

export const get: RequestHandler = async () => {
	const posts = await Post.find({}).populate('ingredients');
	return {
		status: 200,
		body: {
			data: posts
		}
	};
};

export const post: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { ingredients, post_by } = body;

		if (!ingredients && !post_by) {
			return {
				status: 400,
				body: {
					message: 'Missing some required information.'
				}
			};
		}

		// Checking if the given recipe already exists and established in the database or not
		const existingRecipe = await Post.findOne({
			ingredients: { $all: ingredients }
		});

		// If already exists
		if (existingRecipe) {
			return {
				status: 200,
				body: {
					data: existingRecipe
				}
			};
		}

		let ref_id = nanoid(8);

		while (await Post.findOne({ ref_id: ref_id })) {
			ref_id = nanoid(8);
		}

		const payload = { created_at: new Date(), ref_id: ref_id, ...body };

		const post = await Post.create(payload);
		return {
			status: 200,
			body: {
				data: post
			}
		};
	} catch (e) {
		console.log(e);
		return {
			status: 500,
			body: {
				data: JSON.stringify(e)
			}
		};
	}
};
