export class Review {
  public id: string = "";
  public intro: string = "";
  public name: string = "";
  public type: string = "";
  public episodes: number = 0;
  public studio: string = "";
  public source: string = "";
  public demographic: string = "";
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  public genres: string[] = [];
  public rate: number = 0;
  public reviewDate: Date = new Date();
  public malLink: string = "";
  public anilistLink: string = "";
  public kitsuLink: string = "";
}
