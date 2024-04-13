
export interface Post {
    id: number;
    title: string;
    content: string;
    imageUrl: any[];
    price: number,
    userId: string; // Add the userId property to the Post interface
    username?: string;
    categoryId: string;// Add categoryId property
    categoryName: string; // Add categoryName property

}
