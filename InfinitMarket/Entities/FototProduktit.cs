using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace InfinitMarket.Entities
{
    public class FototProduktit
    {
        [BsonId]
        [BsonElement("_id"), BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        [BsonElement("produkti_id"), BsonRepresentation(BsonType.Int32)]
        public int? ProduktiID { get; set; }
        [BsonElement("emri_fotos"), BsonRepresentation(BsonType.String)]
        public string? EmriFotos {  get; set; }
    }
}
