import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

actor {
  type Answer = {
    questionId : Text;
    answerText : Text;
  };

  type ApplicationRecord = {
    id : Nat;
    applicantName : Text;
    discordUsername : Text;
    answers : [Answer];
    timestamp : Int;
    status : Text; // "pending", "accepted", "declined"
  };

  let applications = Map.empty<Nat, ApplicationRecord>();
  var nextId = 0;

  public shared ({ caller }) func submitApplication(applicantName : Text, discordUsername : Text, rawAnswers : [(Text, Text)]) : async Nat {
    let answers = rawAnswers.map(func((q, a)) { { questionId = q; answerText = a } });

    let record : ApplicationRecord = {
      id = nextId;
      applicantName;
      discordUsername;
      answers;
      timestamp = Time.now();
      status = "pending";
    };

    applications.add(nextId, record);
    let id = nextId;
    nextId += 1;
    id;
  };

  public query ({ caller }) func listApplications() : async [ApplicationRecord] {
    let iter = applications.values();
    let array = iter.toArray();
    array.reverse();
  };

  public shared ({ caller }) func updateStatus(id : Nat, status : Text) : async () {
    switch (applications.get(id)) {
      case (?record) {
        assert (status == "pending" or status == "accepted" or status == "declined");
        let updatedRecord = { record with status };
        applications.add(id, updatedRecord);
      };
      case (null) { Runtime.trap("Application not found!") };
    };
  };

  public query ({ caller }) func getApplication(id : Nat) : async ApplicationRecord {
    switch (applications.get(id)) {
      case (?record) { record };
      case (null) { Runtime.trap("Application not found!") };
    };
  };

  public query ({ caller }) func canisterVersion() : async Text { "0" };
};
