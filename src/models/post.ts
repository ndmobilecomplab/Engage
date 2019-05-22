/**
 * Model representing a post in the news feed
 */
export default class Post {
    /**
     * The organization who posted
     */
    public provider: string;

    /**
     * Associated website
     */
    public site: string;

    /**
     * Text of the post
     */
    public bodyText: string;

    /**
     * Date posted
     */
    public postDate: string;
    /**
     * Time posted
     */
    public postTime: string;
    /**
     * Number of positive reactions
     */
    public react1: number;
    /**
     * Number of negative reactions
     */
    public react2: number;


}
