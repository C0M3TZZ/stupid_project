import mongoose, { Model } from 'mongoose';
import type { ITag } from './tags';
import type { IUser } from './user';

interface userTag {
	owner: IUser;
	tags: ITag[];
}

export interface IComment {
	comment_rating: number;
	comment_by: string;
	comment_post_id: string;
	created_at: Date;
	comment_content: string;
	tags: string[];
}

const commentSchema = new mongoose.Schema<IComment>({
	comment_rating: Number,
	comment_by: String,
	comment_post_id: String,
	created_at: Date,
	comment_content: String,
	tags: {
		type: [
			{
				type: String
			}
		]
	}
});

const CommentModel: Model<IComment> =
	mongoose.models.Comments || mongoose.model('Comments', commentSchema);
export default CommentModel;
