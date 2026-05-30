import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, Heart, MessageCircle, Phone } from "lucide-react";

const resources = [
  {
    category: "Meditation & Mindfulness Apps",
    items: [
      {
        name: "Calm",
        description: "Meditation, sleep stories, and relaxation",
        url: "https://www.calm.com",
        icon: "🧘‍♀️",
      },
      {
        name: "Headspace",
        description: "Guided meditation and mindfulness",
        url: "https://www.headspace.com",
        icon: "🎧",
      },
    ],
  },
  {
    category: "Mental Health Support (UK)",
    items: [
      {
        name: "Childline",
        description: "Free, confidential support for young people",
        url: "https://www.childline.org.uk",
        phone: "0800 1111",
        icon: "☎️",
      },
      {
        name: "YoungMinds",
        description: "Mental health support and information",
        url: "https://www.youngminds.org.uk",
        icon: "💭",
      },
      {
        name: "The Mix",
        description: "Support for under 25s",
        url: "https://www.themix.org.uk",
        phone: "0808 808 4994",
        icon: "💬",
      },
      {
        name: "Kooth",
        description: "Free online counselling for young people",
        url: "https://www.kooth.com",
        icon: "🤝",
      },
    ],
  },
  {
    category: "Wellbeing & Self-Care",
    items: [
      {
        name: "NHS Mental Health",
        description: "Trusted advice and resources",
        url: "https://www.nhs.uk/mental-health/children-and-young-adults/",
        icon: "🏥",
      },
      {
        name: "Student Minds",
        description: "Student mental health charity",
        url: "https://www.studentminds.org.uk",
        icon: "🎓",
      },
    ],
  },
  {
    category: "Crisis Support",
    urgent: true,
    items: [
      {
        name: "Emergency Services",
        description: "If you're in immediate danger",
        phone: "999",
        icon: "🚨",
      },
      {
        name: "Samaritans",
        description: "24/7 listening service",
        phone: "116 123",
        url: "https://www.samaritans.org",
        icon: "☎️",
      },
      {
        name: "Crisis Text Line",
        description: "Text SHOUT to 85258",
        phone: "Text: 85258",
        icon: "💬",
      },
    ],
  },
];

export function ResourcesScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 p-6 py-12">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="text-neutral-400"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-10"
        >
          <h1 className="text-2xl font-light text-neutral-800 mb-3">
            Support & resources
          </h1>
          <p className="text-neutral-500">
            You don't have to figure everything out alone.
          </p>
        </motion.div>

        {/* Resources */}
        <div className="space-y-8">
          {resources.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h2 className={`text-sm font-medium mb-4 ${
                section.urgent ? 'text-red-600' : 'text-neutral-600'
              }`}>
                {section.category}
              </h2>
              
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    whileHover={{ scale: 1.01 }}
                    className={`bg-white rounded-2xl p-5 shadow-sm border ${
                      section.urgent
                        ? 'border-red-200 bg-red-50'
                        : 'border-neutral-100'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{item.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-neutral-800 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-3">
                          {item.description}
                        </p>
                        
                        <div className="space-y-2">
                          {item.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-neutral-400" />
                              <span className="text-neutral-700 font-medium">
                                {item.phone}
                              </span>
                            </div>
                          )}
                          
                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-800"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Visit website</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6"
        >
          <Heart className="w-6 h-6 text-blue-400 mb-3" />
          <p className="text-sm text-neutral-700 leading-relaxed">
            Asking for help isn't weakness. It's actually one of the strongest things you can do.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
