using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InfinitMarket.Entities
{
    public class VlersimetEProduktit
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonElement("produktiID"), BsonRepresentation(BsonType.Int32)]
        public int? ProduktiID { get; set; }
        [BsonElement("klientiID"), BsonRepresentation(BsonType.Int32)]
        public int? KlientiID { get; set; }
        [BsonElement("vlersimiTekst"), BsonRepresentation(BsonType.String)]
        public string? VlersimiTekst {  get; set; }
        [BsonElement("vlersimiYll"), BsonRepresentation(BsonType.Double)]
        public int? VlersimiYll { get; set; }
    }
}
