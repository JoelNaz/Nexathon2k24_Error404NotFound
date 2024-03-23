import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const DepartmentCard = ({title,content,footer}:{title:string,content:string,footer:string}) => {
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      <CardFooter >
        <p className="text-[#67666b]">{footer}</p>
      </CardFooter>
    </Card>
  );
};

export default DepartmentCard;
