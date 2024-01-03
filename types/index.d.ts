type FileProps = {
	uid: number;
	mode: number;
	size: number;
	created: string;
	modified: string;
};

type Data = {
	version: number;
	created: string;
	modified: string | null;
	files?: FileProps;
}
